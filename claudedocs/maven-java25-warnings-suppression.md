# Suppressing Maven Warnings with Java 25

## Overview

When running Maven with Java 24/25, two types of warnings appear due to new JEPs (Java Enhancement Proposals):

1. **JEP 472 Warning**: Jansi library native access warning
2. **JEP 498 Warning**: Guava sun.misc.Unsafe deprecation warning

These warnings come from Maven's own dependencies, not from project dependencies.

---

## The Warnings

### 1. Jansi Native Access Warning (JEP 472)
```
WARNING: java.lang.System::load has been called by
org.fusesource.jansi.internal.JansiLoader in an unnamed module
WARNING: Use --enable-native-access=ALL-UNNAMED to avoid a warning for callers
```

### 2. Guava Unsafe Warning (JEP 498)
```
WARNING: sun.misc.Unsafe::objectFieldOffset has been called by
com.google.common.util.concurrent.AbstractFuture$UnsafeAtomicHelper
WARNING: sun.misc.Unsafe::objectFieldOffset is restricted and will be blocked
in a future release
```

---

## Solutions

### Quick Solution: Environment Variables

The simplest approach is to set MAVEN_OPTS before running Maven commands:

**Linux/macOS:**
```bash
export MAVEN_OPTS="--enable-native-access=ALL-UNNAMED --sun-misc-unsafe-memory-access=allow"
mvn spring-boot:run
```

**Windows (Command Prompt):**
```cmd
set MAVEN_OPTS=--enable-native-access=ALL-UNNAMED --sun-misc-unsafe-memory-access=allow
mvn spring-boot:run
```

**Windows (PowerShell):**
```powershell
$env:MAVEN_OPTS="--enable-native-access=ALL-UNNAMED --sun-misc-unsafe-memory-access=allow"
mvn spring-boot:run
```

### Persistent Solution: .mvn/jvm.config

For project-level configuration that applies to all team members, create a `.mvn/jvm.config` file in your project root:

**File: `.mvn/jvm.config`**
```
--enable-native-access=ALL-UNNAMED
--sun-misc-unsafe-memory-access=allow
```

**Benefits:**
- Committed to version control
- Applies automatically for all developers
- No need to set environment variables
- Available in Maven 3.3.1+

### Alternative: System-Level Configuration

**Linux/macOS (~/.bashrc or ~/.zshrc):**
```bash
export MAVEN_OPTS="--enable-native-access=ALL-UNNAMED --sun-misc-unsafe-memory-access=allow"
```

**Windows (System Environment Variables):**
1. Search for "Environment Variables" in Windows
2. Add/Edit `MAVEN_OPTS` system variable
3. Set value: `--enable-native-access=ALL-UNNAMED --sun-misc-unsafe-memory-access=allow`

---

## Understanding the Flags

### --enable-native-access=ALL-UNNAMED
- **Purpose**: Suppresses JNI (Java Native Interface) warnings
- **Target**: Addresses jansi library warnings
- **JEP**: 472 (Prepare to Restrict the Use of JNI)
- **Scope**: ALL-UNNAMED lifts restrictions for all unnamed modules on classpath
- **Risk**: Coarse-grained; may hide legitimate warnings from project code

### --sun-misc-unsafe-memory-access=allow
- **Purpose**: Suppresses sun.misc.Unsafe deprecation warnings
- **Target**: Addresses Guava library warnings
- **JEP**: 498 (Warn upon Use of Memory-Access Methods in sun.misc.Unsafe)
- **Default**: Changed from "allow" to "warn" in Java 24
- **Risk**: May hide legitimate unsafe memory access in project dependencies

---

## Maven Version Status

### Maven 3.9.10+ (Released June 2025)
- **Jansi**: Updated to 2.4.2 (from 2.4.1)
- **Guava**: Updated to 33.4.0-jre (from 33.2.1-jre)
- **Status**: Jansi warnings **still appear** with Java 25
- **Reason**: Fix incomplete; jansi 2.4.2 doesn't fully resolve JEP 472 warnings

### Maven 3.9.11 (Current)
- **Jansi**: 2.4.2 (unchanged)
- **Guava**: Updated to 33.4.5-jre → 33.4.6-jre → 33.4.8-jre
- **Status**:
  - Jansi warnings **still appear**
  - Guava warnings **resolved** in 33.4.8
- **Note**: Issue #11289 shows jansi warnings persist

### Maven 3.9.12 (Planned)
- **Expected**: Additional fixes for Guice-related Unsafe warnings
- **Status**: Unreleased as of January 2025

### Maven 4.0.0 (Alpha/RC)
- **Jansi**: Removed entirely (no longer a dependency)
- **Status**: Eliminates jansi warnings completely
- **Note**: Still in development; not production-ready

---

## Library Update Status

### Jansi Library
| Version | JEP 472 Status | Notes |
|---------|---------------|-------|
| 2.4.0 | Warnings | Used in Maven 3.9.9 |
| 2.4.1 | Warnings | Used in Maven 3.9.10 |
| 2.4.2 | **Still warns** | Current in Maven 3.9.11 |
| Future | Unknown | Awaiting upstream fix |

### Google Guava
| Version | JEP 498 Status | Notes |
|---------|---------------|-------|
| 33.2.1-jre | Warnings | Used in Maven 3.9.9 |
| 33.4.0-jre | Improved | Partial fix |
| 33.4.5-jre | Better | Modularization improvements |
| 33.4.6-jre | Better | Build fixes |
| 33.4.7-jre | Broken | Android minSdk issues |
| 33.4.8-jre | **Fixed** | Current; uses AtomicReferenceFieldUpdater |

---

## Spring Boot Configuration

### Option 1: pom.xml Configuration
```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <jvmArguments>
            --enable-native-access=ALL-UNNAMED
            --sun-misc-unsafe-memory-access=allow
        </jvmArguments>
    </configuration>
</plugin>
```

**Note**: This configures the Spring Boot application JVM, not Maven's JVM.

### Option 2: Command Line
```bash
mvn spring-boot:run \
  -Dspring-boot.run.jvmArguments="--enable-native-access=ALL-UNNAMED --sun-misc-unsafe-memory-access=allow"
```

### Option 3: Combined (Maven + Application)
Use `.mvn/jvm.config` for Maven warnings AND pom.xml for application warnings.

---

## Maven Wrapper Considerations

If using Maven Wrapper (`mvnw`), warnings may persist even with MAVEN_OPTS. This is a known issue (#11289).

**Workaround:**
1. Use "only-script" wrapper type
2. Or configure JVM options in `.mvn/jvm.config` (preferred)

**File: `.mvn/maven-wrapper.properties`**
```properties
wrapperType=only-script
```

---

## Best Practices

### Development Environment
1. **Use .mvn/jvm.config** - Commit to version control for team consistency
2. **Document the workaround** - Add comments explaining temporary nature
3. **Monitor Maven releases** - Check for official fixes in new versions

### Production Environment
1. **Avoid suppressing warnings** - May hide real issues
2. **Upgrade Maven** - Use latest 3.9.x or 4.0.x when stable
3. **Test thoroughly** - Ensure suppression doesn't mask project issues

### CI/CD Pipelines
```yaml
# GitHub Actions example
env:
  MAVEN_OPTS: --enable-native-access=ALL-UNNAMED --sun-misc-unsafe-memory-access=allow

# GitLab CI example
variables:
  MAVEN_OPTS: "--enable-native-access=ALL-UNNAMED --sun-misc-unsafe-memory-access=allow"
```

---

## Important Warnings

### These Are Temporary Workarounds
- **Not a permanent solution**: Suppresses symptoms, not root cause
- **May hide real issues**: Could mask legitimate warnings from your code
- **Should be removed**: Once Maven/dependencies are updated

### Security Considerations
- `ALL-UNNAMED` is coarse-grained; affects all unnamed modules
- May allow unsafe native access from project dependencies
- Use with caution in security-sensitive applications

### When to Use
✅ **Use when:**
- Working with Maven 3.9.x and Java 24/25
- Warnings clutter build output
- Need clean CI/CD logs
- Team needs consistent environment

❌ **Don't use when:**
- You can upgrade to Maven 4.0+ (removes jansi)
- Working with Java 23 or earlier
- Need to audit all native access
- Security policies prohibit unsafe flags

---

## Verification

### Check if warnings are suppressed:
```bash
# Set options
export MAVEN_OPTS="--enable-native-access=ALL-UNNAMED --sun-misc-unsafe-memory-access=allow"

# Run Maven (should be silent)
mvn clean compile

# Verify MAVEN_OPTS is active
echo $MAVEN_OPTS
```

### Test .mvn/jvm.config:
```bash
# Create file
mkdir -p .mvn
echo "--enable-native-access=ALL-UNNAMED" > .mvn/jvm.config
echo "--sun-misc-unsafe-memory-access=allow" >> .mvn/jvm.config

# Run Maven (should be silent)
mvn clean compile
```

---

## Related Issues

### Apache Maven JIRA
- **MNG-8248**: jansi System::load warning (Fixed in 3.9.10, but still appears)
- **MNG-8721**: jansi warnings on JDK 24 (Duplicate of MNG-8248)
- **MNG-8399**: Guava Unsafe warnings (Fixed in 3.9.10 via Guava upgrade)
- **MNG-8443**: Guava upgrade to 33.4.0-jre
- **MNG-8636**: Guava upgrade to 33.4.5-jre
- **MNG-8661**: Guava upgrade to 33.4.6-jre
- **MNG-8704**: Guava upgrade to 33.4.8-jre
- **MNG-8715**: jansi upgrade to 2.4.2

### GitHub Issues
- **#10391**: Original jansi warning fix (Incomplete)
- **#11289**: Regression report for Maven 3.9.11 (Closed as external issue)
- **google/guava#7565**: Guava Unsafe deprecation (Fixed in 33.4.8)

---

## Official Documentation

- [JEP 472: Prepare to Restrict the Use of JNI](https://openjdk.org/jeps/472)
- [JEP 498: Warn upon Use of Memory-Access Methods in sun.misc.Unsafe](https://openjdk.org/jeps/498)
- [Maven Configuration Documentation](https://maven.apache.org/configure.html)
- [Maven .mvn Directory](https://maven.apache.org/docs/3.9.0/release-notes.html#overview-about-the-changes)

---

## Timeline

- **Java 24 EA**: Warnings introduced (JEP 472, JEP 498)
- **June 2025**: Maven 3.9.10 released (partial fixes)
- **October 2025**: Maven 3.9.11 released (Guava fixed, jansi persists)
- **January 2025**: Maven 3.9.12 planned (additional Guice fixes)
- **Future**: Maven 4.0.0 stable (jansi removed)
- **Future Java**: Restrictions will be enforced (warnings → errors)

---

## Recommended Configuration

**For most projects using Maven 3.9.x with Java 25:**

**File: `.mvn/jvm.config`**
```
--enable-native-access=ALL-UNNAMED
--sun-misc-unsafe-memory-access=allow
```

**File: `.mvn/README.md`**
```markdown
# Maven JVM Configuration

## Purpose
Suppresses Java 25 JEP warnings from Maven's dependencies (jansi and guava).

## Temporary Workaround
These flags are temporary until:
- Maven 4.0+ is stable (removes jansi dependency)
- All libraries update for Java 25 compatibility

## References
- JEP 472: https://openjdk.org/jeps/472
- JEP 498: https://openjdk.org/jeps/498
- Maven Issue MNG-8248
```

---

## Summary

**Quick Fix:**
```bash
export MAVEN_OPTS="--enable-native-access=ALL-UNNAMED --sun-misc-unsafe-memory-access=allow"
```

**Project Fix:**
Create `.mvn/jvm.config` with both flags.

**Long-term Fix:**
Wait for Maven 4.0.0 stable release or library updates.

**Status:**
- Jansi warnings: **Not fixed** (as of Maven 3.9.11)
- Guava warnings: **Fixed** (as of Guava 33.4.8 in Maven 3.9.11)
